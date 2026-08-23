const sharp=require('sharp');
(async()=>{const {data,info}=await sharp(process.argv[2]).raw().toBuffer({resolveWithObject:true});
const ch=info.channels;let minX=1e9,maxX=-1,minY=1e9,maxY=-1,n=0;
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=(y*info.width+x)*ch;
const r=data[i],g=data[i+1],b=data[i+2];
if(r>200&&g<215&&b<215&&r-g>25&&r-b>25){n++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
console.log({minX,maxX,minY,maxY,w:maxX-minX,h:maxY-minY,n});})();
