(this.webpackJsonpchat_client=this.webpackJsonpchat_client||[]).push([[0],[,,,,,,,,,,,,,function(e,t,s){},function(e,t,s){},function(e,t,s){},,function(e,t,s){},function(e,t,s){},,function(e,t,s){"use strict";s.r(t);var a=s(2),n=s.n(a),r=s(8),i=s.n(r),c=(s(13),s(3)),o=s(4),d=s(1),l=s(6),u=s(5),h=(s(14),s(15),s(0)),j=function(e){Object(l.a)(s,e);var t=Object(u.a)(s);function s(e){var a;return Object(c.a)(this,s),(a=t.call(this,e)).state={url:e.url,message:"",token:e.token,typeable:e.typeable,formText:"",error:""},a.handleChange=a.handleChange.bind(Object(d.a)(a)),a.save=a.save.bind(Object(d.a)(a)),a}return Object(o.a)(s,[{key:"handleChange",value:function(e){this.setState({message:e.target.value})}},{key:"save",value:function(e){var t=this;this.setState({error:""}),e.preventDefault();var s=new FormData;s.append("message",this.state.message),this.setState({token:this.props.token}),fetch(this.state.url+"/message",{method:"POST",headers:new Headers({Authorization:"Bearer "+this.state.token}),mode:"cors",body:s}).then((function(e){if(e.ok)return e.json();t.setState({error:e.status})})).then((function(e){})).catch((function(e){t.setState({requestFailed:!0})})),this.setState({message:""})}},{key:"componentDidUpdate",value:function(e){this.props.typeable!==e.typeable&&this.setState({typeable:this.props.typeable})}},{key:"render",value:function(){var e;return""!==this.state.error&&(e=Object(h.jsxs)("p",{style:{color:"red"},children:[this.state.error," Error"]})),this.state.typeable?Object(h.jsxs)("div",{id:"compose",children:[e,Object(h.jsx)("form",{className:"message",onSubmit:this.save,children:Object(h.jsx)("input",{id:"messageText",type:"text",value:this.state.message,onChange:this.handleChange})})]}):Object(h.jsxs)("div",{id:"compose",children:[e,Object(h.jsx)("form",{className:"message",children:Object(h.jsx)("input",{id:"messageText",type:"text",value:"Please reconnect to type a message.",disabled:"disabled"})})]})}}]),s}(a.Component),p=function(e){Object(l.a)(s,e);var t=Object(u.a)(s);function s(e){var a;return Object(c.a)(this,s),(a=t.call(this,e)).state={url:"",username:"",password:"",error:""},a.handleChange=a.handleChange.bind(Object(d.a)(a)),a.save=a.save.bind(Object(d.a)(a)),a}return Object(o.a)(s,[{key:"handleChange",value:function(e){"username"===e.target.id?this.setState({username:e.target.value}):"password"===e.target.id?this.setState({password:e.target.value}):"url"===e.target.id&&this.setState({url:e.target.value})}},{key:"save",value:function(e){var t=this;this.setState({error:""});var s=new URLSearchParams;s.append("username",this.state.username),s.append("password",this.state.password),e.preventDefault(),fetch(this.state.url+"/login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},mode:"cors",body:s.toString()}).then((function(e){if(e.ok)return e.json();t.setState({error:e.status})})).then((function(e){t.props.saveToken(e.token),t.props.saveURL(t.state.url),t.props.loggedIn(),t.props.startStream()})).catch((function(e){t.setState({requestFailed:!0})}))}},{key:"render",value:function(){var e;return""!==this.state.error&&(e=Object(h.jsxs)("p",{style:{color:"red"},children:[this.state.error," Error"]})),Object(h.jsx)("div",{id:"login",children:Object(h.jsxs)("div",{children:[e,Object(h.jsx)("h2",{children:"Login"}),Object(h.jsxs)("form",{method:"post",onSubmit:this.save,children:[Object(h.jsxs)("label",{children:["URL ",Object(h.jsx)("br",{}),Object(h.jsx)("input",{id:"url",type:"text",onChange:this.handleChange})]}),Object(h.jsx)("br",{}),Object(h.jsxs)("label",{children:["Username ",Object(h.jsx)("br",{}),Object(h.jsx)("input",{id:"username",type:"text",onChange:this.handleChange})]}),Object(h.jsx)("br",{}),Object(h.jsxs)("label",{children:["Password ",Object(h.jsx)("br",{}),Object(h.jsx)("input",{id:"password",type:"password",onChange:this.handleChange})]}),Object(h.jsx)("br",{}),Object(h.jsx)("button",{type:"submit",children:"Submit"})]})]})})}}]),s}(a.Component),b=(s(17),function(e){Object(l.a)(s,e);var t=Object(u.a)(s);function s(e){var a;return Object(c.a)(this,s),(a=t.call(this,e)).state={displayMessages:e.displayMessages,messages:e.messages},a}return Object(o.a)(s,[{key:"componentDidUpdate",value:function(e){this.props.displayMessages!==e.displayMessages&&this.setState({displayMessages:this.props.displayMessages}),this.props.messages!==e.messages&&this.setState({messages:this.props.messages})}},{key:"render",value:function(){var e;return this.state.displayMessages&&(e=this.state.messages.map((function(e,t){return Object(h.jsx)("ul",{children:e},t)}))),Object(h.jsxs)("div",{className:"messageList",children:[Object(h.jsx)("p",{children:"Messages"}),e]})}}]),s}(a.Component)),g=(s(18),function(e){Object(l.a)(s,e);var t=Object(u.a)(s);function s(e){var a;return Object(c.a)(this,s),(a=t.call(this,e)).state={displayUsers:e.displayUsers,users:e.users},a}return Object(o.a)(s,[{key:"componentDidUpdate",value:function(e){this.props.displayUsers!==e.displayUsers&&this.setState({displayUsers:this.props.displayUsers}),this.props.users!==e.users&&this.setState({users:this.props.users})}},{key:"render",value:function(){var e;return this.state.displayUsers&&(e=this.state.users.map((function(e,t){return Object(h.jsx)("ul",{children:e},t)}))),Object(h.jsxs)("div",{className:"userList",children:[Object(h.jsx)("p",{children:"Online"}),e]})}}]),s}(a.Component)),v=function(e){Object(l.a)(s,e);var t=Object(u.a)(s);function s(e){var a;return Object(c.a)(this,s),(a=t.call(this,e)).state={url:sessionStorage.url||"http://droplet.faizsurani.com",messages:[],users:[],displayUsers:!1,displayMessages:!1,displayLogin:!0,reconnecting:!1,token:sessionStorage.accessToken||""},a.addUser=a.addUser.bind(Object(d.a)(a)),a.deleteUser=a.deleteUser.bind(Object(d.a)(a)),a.formatDate=a.formatDate.bind(Object(d.a)(a)),a.loggedIn=a.loggedIn.bind(Object(d.a)(a)),a.saveToken=a.saveToken.bind(Object(d.a)(a)),a.saveURL=a.saveURL.bind(Object(d.a)(a)),a.startStream=a.startStream.bind(Object(d.a)(a)),a}return Object(o.a)(s,[{key:"addUser",value:function(e){this.state.users.filter((function(t){return t===e})).length>0||this.setState((function(t){return{users:t.users.concat(e)}}))}},{key:"deleteUser",value:function(e){this.setState((function(t){return{users:t.users.filter((function(t){return t!==e}))}}))}},{key:"formatDate",value:function(e){var t=new Date(1e3*e);return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(t)}},{key:"loggedIn",value:function(){this.setState({displayLogin:!1}),this.setState({displayUsers:!0}),this.setState({displayMessages:!0})}},{key:"saveToken",value:function(e){sessionStorage.accessToken=e,this.setState({token:e})}},{key:"saveURL",value:function(e){this.setState({url:e})}},{key:"startStream",value:function(){var e=this;this.eventSource=new EventSource(this.state.url+"/stream/"+sessionStorage.accessToken),this.eventSource.addEventListener("Disconnect",(function(t){e.eventSource.close(),delete sessionStorage.accessToken,e.setState({displayLogin:!0}),e.setState({displayUsers:!1}),e.setState({displayMessages:!1})}),!1),this.eventSource.addEventListener("Join",(function(t){e.setState({reconnecting:!1}),e.setState({displayUsers:!0});var s=JSON.parse(t.data);e.addUser(s.user),e.setState((function(t){return{messages:t.messages.concat(e.formatDate(s.created)+" JOIN: "+s.user)}}))}),!1),this.eventSource.addEventListener("Message",(function(t){e.setState({reconnecting:!1}),e.setState({displayUsers:!0});var s=JSON.parse(t.data);e.setState((function(t){return{messages:t.messages.concat(e.formatDate(s.created)+" ("+s.user+") "+s.message)}}))}),!1),this.eventSource.addEventListener("Part",(function(t){e.setState({reconnecting:!1}),e.setState({displayUsers:!0});var s=JSON.parse(t.data);e.deleteUser(s.user),e.setState((function(t){return{messages:t.messages.concat(e.formatDate(s.created)+" PART: "+s.user)}}))}),!1),this.eventSource.addEventListener("ServerStatus",(function(t){e.setState({reconnecting:!1}),e.setState({displayUsers:!0});var s=JSON.parse(t.data);e.setState((function(t){return{messages:t.messages.concat(e.formatDate(s.created)+" STATUS: "+s.status)}}))}),!1),this.eventSource.addEventListener("Users",(function(t){e.setState({displayLogin:!1}),e.setState({displayUsers:!0}),e.setState({displayMessages:!0}),e.setState({reconnecting:!1}),e.setState({users:JSON.parse(t.data).users})}),!1),this.eventSource.addEventListener("error",(function(t){e.setState({reconnecting:!0}),e.setState({displayUsers:!1}),2===t.target.readyState&&(delete sessionStorage.accessToken,e.setState({displayLogin:!0}))}),!1)}},{key:"render",value:function(){return this.state.displayLogin?Object(h.jsxs)("div",{className:"App",children:[Object(h.jsx)("br",{}),Object(h.jsx)("h3",{children:" Disconnected. "}),Object(h.jsx)("br",{}),Object(h.jsx)(p,{loggedIn:this.loggedIn,saveToken:this.saveToken,saveURL:this.saveURL,startStream:this.startStream})]}):this.state.reconnecting?Object(h.jsxs)("div",{className:"App",children:[Object(h.jsx)("br",{}),Object(h.jsx)("h3",{children:" Disconnected, retrying "}),Object(h.jsx)("br",{}),Object(h.jsxs)("div",{className:"lists",children:[Object(h.jsx)("div",{class:"col-9",children:Object(h.jsx)(b,{displayMessages:this.state.displayMessages,messages:this.state.messages})}),Object(h.jsx)("div",{class:"col-3",children:Object(h.jsx)(g,{displayUsers:this.state.displayUsers,users:this.state.users})})]}),Object(h.jsx)("hr",{}),Object(h.jsx)(j,{url:this.state.url,token:this.state.token,typeable:!1}),Object(h.jsx)("br",{})," ",Object(h.jsx)("br",{})]}):Object(h.jsxs)("div",{className:"App",children:[Object(h.jsx)("br",{}),Object(h.jsx)("h3",{children:" Connected. "}),Object(h.jsx)("br",{}),Object(h.jsxs)("div",{className:"lists",children:[Object(h.jsx)("div",{class:"col-9",children:Object(h.jsx)(b,{displayMessages:this.state.displayMessages,messages:this.state.messages})}),Object(h.jsx)("div",{class:"col-3",children:Object(h.jsx)(g,{displayUsers:this.state.displayUsers,users:this.state.users})})]}),Object(h.jsx)("hr",{}),Object(h.jsx)(j,{url:this.state.url,token:this.state.token,typeable:!0}),Object(h.jsx)("br",{})," ",Object(h.jsx)("br",{})]})}}]),s}(a.Component),O=function(e){e&&e instanceof Function&&s.e(3).then(s.bind(null,21)).then((function(t){var s=t.getCLS,a=t.getFID,n=t.getFCP,r=t.getLCP,i=t.getTTFB;s(e),a(e),n(e),r(e),i(e)}))};s(19);i.a.render(Object(h.jsx)(n.a.StrictMode,{children:Object(h.jsx)(v,{})}),document.getElementById("root")),O()}],[[20,1,2]]]);
//# sourceMappingURL=main.21ff988b.chunk.js.map