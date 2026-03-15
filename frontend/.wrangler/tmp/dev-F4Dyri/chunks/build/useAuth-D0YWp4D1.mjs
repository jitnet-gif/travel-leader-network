import{u as s}from"./useSupabase-B1s_DZxO.mjs";import{n as a,v as n}from"./server.mjs";const r=n.ref(null),t=n.ref(!0),useAuth=()=>{const n=s();return{user:r,loading:t,init:()=>{},signOut:async()=>{await n.auth.signOut(),r.value=null,await a("/login")}}};export{useAuth as u};
//# sourceMappingURL=useAuth-D0YWp4D1.mjs.map
