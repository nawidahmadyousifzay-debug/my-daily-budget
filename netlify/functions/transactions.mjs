import { getDatabase } from '@netlify/database';
import { randomUUID } from 'node:crypto';
export default async (request) => {
  const pin = Netlify.env.get('BUDGET_PIN');
  if (!pin) return Response.json({error:'BUDGET_PIN is not configured in Netlify environment variables.'},{status:503});
  if (request.headers.get('x-budget-pin') !== pin) return Response.json({error:'Unauthorized'},{status:401});
  const db=getDatabase(); const url=new URL(request.url); const id=url.pathname.split('/').filter(Boolean).pop();
  try {
    if(request.method==='GET') return Response.json(await db.sql`SELECT id,type,date::text AS date,amount::float8 AS amount,category,description FROM transactions ORDER BY date DESC,created_at DESC`);
    if(request.method==='POST') { const b=await request.json(); const {type,date,amount,category,description=''}=b;
      if(!['income','expense','saving'].includes(type)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(amount)||amount<=0||amount>100000000000||typeof category!=='string'||category.length>80||typeof description!=='string'||description.length>160) return Response.json({error:'Invalid transaction data'},{status:400});
      const newId=randomUUID(); await db.sql`INSERT INTO transactions(id,type,date,amount,category,description) VALUES(${newId},${type},${date},${amount},${category},${description})`; return Response.json({id:newId},{status:201}); }
    if(request.method==='DELETE'&&id){await db.sql`DELETE FROM transactions WHERE id=${id}`;return Response.json({ok:true});}
    return Response.json({error:'Method not allowed'},{status:405});
  } catch(e){return Response.json({error:'Database operation failed'},{status:500});}
};
export const config={path:'/api/transactions/*'};
