import sys, numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(3)
Y0,Y1=247,978   # zone illustration
def kmeans(px,k,it=12):
    c=px[rng.choice(len(px),k,replace=False)].astype(float)
    for _ in range(it):
        d=((px[:,None,:]-c[None])**2).sum(-1); l=d.argmin(1)
        for j in range(k):
            m=px[l==j]
            if len(m): c[j]=m.mean(0)
    return c
def grain(a,amt=14):
    h,w,_=a.shape
    n=rng.normal(0,1,(h//2+1,w//2+1)); n=np.kron(n,np.ones((2,2)))[:h,:w]
    return np.clip(a+n[...,None]*amt,0,255)
def stylize(src,dst,back=False,k=10):
    im=Image.open(src).convert('RGB'); a=np.asarray(im).astype(float)
    reg=a[Y0:Y1].copy()
    small=Image.fromarray(reg.astype(np.uint8)).filter(ImageFilter.MedianFilter(5))
    s=np.asarray(small).astype(float)
    samp=s[::6,::6].reshape(-1,3)
    c=kmeans(samp,k)
    # push palette toward game look: more contrast & saturation
    lum=c.mean(1,keepdims=True); c=np.clip((c-lum)*1.3+ (lum-128)*1.05+128,0,255)
    INK=np.array([31,26,23.]); CREAM=np.array([244,205,150.]); GOLD=np.array([226,161,43.])
    for j in range(len(c)):
        r,g,b=c[j]; L=c[j].mean()
        if L<40 and (c[j].max()-c[j].min())<22: c[j]=INK
        elif L>165 and r>=b and r-b>25: c[j]=GOLD if back else CREAM
    flat=s.reshape(-1,3); d=((flat[:,None,:]-c[None])**2).sum(-1); lab=d.argmin(1)
    q=c[lab].reshape(s.shape)
    q=Image.fromarray(q.astype(np.uint8)).filter(ImageFilter.MedianFilter(3))
    q=grain(np.asarray(q).astype(float))
    a[Y0:Y1]=q
    Image.fromarray(a.astype(np.uint8)).save(dst)
if __name__=='__main__':
    stylize(sys.argv[1],sys.argv[2],sys.argv[3]=='b')
