import axios from 'axios';
const BACKEND=process.env.BACKEND_BASE_URL||'http://127.0.0.1:8080';
async function main(){
  const r=await axios.post(BACKEND.replace(/\/$/,'')+'/api/checkout/create',{plan:'pass14',currency:'USD'},{validateStatus:()=>true});
  if(r.status<200||r.status>=300||!r.data?.url) throw new Error('checkout failed');
  console.log('checkout url:', r.data.url);
}
main().catch(e=>{ console.error(e); process.exit(1); });
