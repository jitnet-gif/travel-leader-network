import{u as a}from"./useSupabase-B1s_DZxO.mjs";const useUserRole=async()=>{var u,e,l,o;const r=a(),{data:t}=await r.auth.getUser();return(null==(e=null==(u=null==t?void 0:t.user)?void 0:u.user_metadata)?void 0:e.role)||(null==(o=null==(l=null==t?void 0:t.user)?void 0:l.app_metadata)?void 0:o.role)||"tour_leader"};export{useUserRole as u};
//# sourceMappingURL=useUserRole-CGOAnWdi.mjs.map
