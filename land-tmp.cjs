const sharp=require('sharp');
// The pale blue-grey landmass: distinguishable from the near-white page background.
(async()=>{for(const f of process.argv.slice(2)){
const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
const ch=info.channels;let minX=1e9,maxX=-1,minY=1e9,maxY=-1,n=0;
for(let y=100;y<820;y++)for(let x=400;x<1439;x++){const i=(y*info.width+x)*ch;
const r=data[i],g=data[i+1],b=data[i+2];
if(r>140&&r<215&&b>r+8&&g>r+3&&b<230){n++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
console.log(f.split('/').pop(),{minX,maxX,minY,maxY,w:maxX-minX,h:maxY-minY,n});}})();
