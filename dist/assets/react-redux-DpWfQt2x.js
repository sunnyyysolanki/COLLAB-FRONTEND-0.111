import{r as u}from"./react-kDj6t8jd.js";import{w as N}from"./use-sync-external-store-DV0KjrHr.js";function L(t){t()}function k(){let t=null,s=null;return{clear(){t=null,s=null},notify(){L(()=>{let e=t;for(;e;)e.callback(),e=e.next})},get(){const e=[];let r=t;for(;r;)e.push(r),r=r.next;return e},subscribe(e){let r=!0;const n=s={callback:e,next:null,prev:s};return n.prev?n.prev.next=n:t=n,function(){!r||t===null||(r=!1,n.next?n.next.prev=n.prev:s=n.prev,n.prev?n.prev.next=n.next:t=n.next)}}}}var C={notify(){},get:()=>[]};function D(t,s){let e,r=C,n=0,i=!1;function a(R){d();const E=r.subscribe(R);let h=!1;return()=>{h||(h=!0,E(),f())}}function l(){r.notify()}function o(){S.onStateChange&&S.onStateChange()}function b(){return i}function d(){n++,e||(e=t.subscribe(o),r=k())}function f(){n--,e&&n===0&&(e(),e=void 0,r.clear(),r=C)}function p(){i||(i=!0,d())}function g(){i&&(i=!1,f())}const S={addNestedSub:a,notifyNestedSubs:l,handleChangeWrapper:o,isSubscribed:b,trySubscribe:p,tryUnsubscribe:g,getListeners:()=>r};return S}var M=()=>typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",U=M(),V=()=>typeof navigator<"u"&&navigator.product==="ReactNative",H=V(),P=()=>U||H?u.useLayoutEffect:u.useEffect,T=P(),v=Symbol.for("react-redux-context"),x=typeof globalThis<"u"?globalThis:{};function j(){if(!u.createContext)return{};const t=x[v]??(x[v]=new Map);let s=t.get(u.createContext);return s||(s=u.createContext(null),t.set(u.createContext,s)),s}var c=j();function I(t){const{children:s,context:e,serverState:r,store:n}=t,i=u.useMemo(()=>{const o=D(n);return{store:n,subscription:o,getServerState:r?()=>r:void 0}},[n,r]),a=u.useMemo(()=>n.getState(),[n]);T(()=>{const{subscription:o}=i;return o.onStateChange=o.notifyNestedSubs,o.trySubscribe(),a!==n.getState()&&o.notifyNestedSubs(),()=>{o.tryUnsubscribe(),o.onStateChange=void 0}},[i,a]);const l=e||c;return u.createElement(l.Provider,{value:i},s)}var z=I;function y(t=c){return function(){return u.useContext(t)}}var m=y();function w(t=c){const s=t===c?m:y(t),e=()=>{const{store:r}=s();return r};return Object.assign(e,{withTypes:()=>e}),e}var W=w();function q(t=c){const s=t===c?W:w(t),e=()=>s().dispatch;return Object.assign(e,{withTypes:()=>e}),e}var F=q(),A=(t,s)=>t===s;function B(t=c){const s=t===c?m:y(t),e=(r,n={})=>{const{equalityFn:i=A}=typeof n=="function"?{equalityFn:n}:n,a=s(),{store:l,subscription:o,getServerState:b}=a;u.useRef(!0);const d=u.useCallback({[r.name](p){return r(p)}}[r.name],[r]),f=N.useSyncExternalStoreWithSelector(o.addNestedSub,l.getState,b||l.getState,d,i);return u.useDebugValue(f),f};return Object.assign(e,{withTypes:()=>e}),e}var G=B();export{z as P,G as a,F as u};
