import{I as s}from"../nitro/nitro.mjs";import{k as r,n as e}from"./server.mjs";import{u as t}from"./useSupabase-B1s_DZxO.mjs";import"../routes/renderer.mjs";import"../_/shared.esm-bundler.mjs";const o=r(async()=>{let r,o;const a=t(),{data:m}=([r,o]=s(()=>a.auth.getSession()),r=await r,o(),r);if(!m.session)return e("/login")});export{o as default};
//# sourceMappingURL=auth-Cezl9Igh.mjs.map
