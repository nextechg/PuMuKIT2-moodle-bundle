YUI.add("moodle-atto_pumukit-button",function(e,t){var n="http://localhost/app_dev.php/searchmultimediaobjects",r="atto_pumukit",i="pumukit_flavor",s="atto_pumukit",o={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",FLAVORCONTROL:"flavorcontrol"},u={FLAVORCONTROL:".flavorcontrol"},a='<iframe src="{{PUMUKITURL}}" frameborder="0" allowfullscreen style="width:100%;height:80vh"></iframe><form class="atto_form"><input class="{{CSS.FLAVORCONTROL}}" id="{{elementid}}_{{FLAVORCONTROL}}" name="{{elementid}}_{{FLAVORCONTROL}}" value="{{defaultflavor}}" type="hidden" /></form>';e.namespace("M.atto_pumukit").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{initializer:function(){if(this.get("disabled"))return;this.addButton({icon:"icon",iconComponent:"atto_pumukit",buttonName:"pumukit",callback:this._displayDialogue,callbackArgs:"iconone"})},_getFlavorControlName:function(){return this.get("host").get("elementid")+"_"+i},_displayDialogue:function(t,n){t.preventDefault();var i=900;window.addEventListener("message",this._receiveMessage.bind(this),{once:!0});var s=this.getDialogue({headerContent:M.util.get_string("dialogtitle",r),width:i+"px",focusAfterHide:n});s.width!==i+"px"&&s.set("width",i+"px");var o=this._getFormContent(n),u=e.Node.create("<div></div>");u.append(o),s.set("bodyContent",u),s.show(),this.markUpdated()},_getFormContent:function(t){var s=e.Handlebars.compile(a),u=e.Node.create(s({elementid:this.get("host").get("elementid"),CSS:o,FLAVORCONTROL:i,PUMUKITURL:n,component:r,defaultflavor:this.get("defaultflavor"),clickedicon:t}));return this._form=u,u},_doInsert:function(e){e.preventDefault(),this.getDialogue({focusAfterHide:null}).hide();var t=this._form.one(u.FLAVORCONTROL);if(!t.get("value"))return;this.editor.focus(),this.get("host").insertContentAtFocusPoint(t.get("value")),this.markUpdated()},_receiveMessage:function(e){if(e.data.type!="atto_pumukit")return;e.preventDefault(),this.getDialogue({focusAfterHide:null}).hide();if(!e.data.url)return;this.editor.focus(),this.get("host").insertContentAtFocusPoint(e.data.url),this.markUpdated()}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});