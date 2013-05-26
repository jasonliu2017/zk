/* window.js

	Purpose:
		
	Description:
		
	History:
		Mon Nov 17 17:51:57     2008, Created by tomyeh

Copyright (C) 2008 Potix Corporation. All Rights Reserved.

This program is distributed under LGPL Version 2.1 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
function (out, skipper) {
	var zcls = this.getZclass(),
		dcls = this.domClass_(),
		uuid = this.uuid,
		title = this.getTitle(),
		caption = this.caption,
		contentStyle = this.getContentStyle(),
		contentSclass = this.getContentSclass(),
		withFrame = zul.wnd.WindowRenderer.shallCheckBorder(this),
		bordercls = this._border;

	bordercls = 'normal' == bordercls ? '':
		'none' == bordercls ? '-noborder' : '-' + bordercls;
	var isNoBorderOrPopup = bordercls == '-noborder' || dcls.indexOf(zcls + '-popup') !== -1

	out.push('<div', this.domAttrs_(), '>');

	
	if(!isNoBorderOrPopup)
		out.push('<div class="', zcls,'-outer">');
	
	if (caption || title) {
		if(isNoBorderOrPopup)
			out.push('<div id="',
					uuid, '-caption-outer" class="', zcls, '-header-outer">');
			
		out.push('<div id="',
			uuid, '-caption" class="', zcls, '-header">');

		if (caption) caption.redraw(out);
		else {
			var iconInner = '<div class="' + zcls + '-icon-img"></div>';
			
			var getIcon = function(type, iconClass) {
				return '<button id="' + uuid + '-' + type + '" class="z-button ' + zcls + '-icon-img" style="padding: 0px;height: 100%; width: 100%;"><i class="' + zcls + '-icon z-' + iconClass + '"></i></button>';
			}
			
			if (this._closable)
				out.push('<div class="', zcls, '-icon ', zcls, '-close">' , getIcon('close', 'icon-remove') ,  '</div>');
			if (this._maximizable) {
				out.push('<div class="', zcls, '-icon ', zcls, '-maximize');
				if (this._maximized)
					out.push(' ', zcls, '-maximized');
				out.push('">', this._maximized ? getIcon('maximize', 'icon-chevron-down') : getIcon('maximize', 'icon-chevron-up') , '</div>');
			}
			if (this._minimizable)
				out.push('<div class="', zcls, '-icon ', zcls, '-minimize">', getIcon('minimize', 'icon-minus'), '</div>');
			out.push(zUtl.encodeXML(title));
		}
		
		if(isNoBorderOrPopup)
			out.push('</div>');
		
		out.push('</div>');
	} 
	
	out.push('<div id="', uuid, '-cave" class="');
	if (contentSclass) out.push(contentSclass, ' ');
	out.push(zcls, '-content', bordercls, '"');
	if (contentStyle) out.push(' style="', contentStyle, '"');
	out.push('>');

	if (!skipper)
		for (var w = this.firstChild; w; w = w.nextSibling)
			if (w != caption)
				w.redraw(out);

	out.push('</div>');

	if (!isNoBorderOrPopup)
		out.push('</div>');

	out.push('</div>');
}