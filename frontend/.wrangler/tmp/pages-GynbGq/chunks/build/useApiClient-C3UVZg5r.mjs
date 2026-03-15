import{i as e}from"./server.mjs";const useApiClient=()=>{const s=e().public.apiBase;return{get:e=>$fetch(e,{baseURL:s}),post:(e,t)=>$fetch(e,{baseURL:s,method:"POST",body:t})}};export{useApiClient as u};
//# sourceMappingURL=useApiClient-C3UVZg5r.mjs.map
