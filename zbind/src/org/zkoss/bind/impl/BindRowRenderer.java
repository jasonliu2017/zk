/* BindRowRenderer.java

	Purpose:
		
	Description:
		
	History:
		Aug 16, 2011 10:34:50 AM, Created by henrichen

Copyright (C) 2011 Potix Corporation. All Rights Reserved.
*/

package org.zkoss.bind.impl;

import org.zkoss.lang.Objects;
import org.zkoss.xel.VariableResolverX;
import org.zkoss.xel.XelContext;
import org.zkoss.xel.XelException;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.UiException;
import org.zkoss.zk.ui.util.Template;
import org.zkoss.zul.Grid;
import org.zkoss.zul.Label;
import org.zkoss.zul.Row;
import org.zkoss.zul.RowRenderer;
import org.zkoss.zul.Rows;

/**
 * Row renderer for binding.
 * @author henrichen
 *
 */
public class BindRowRenderer implements RowRenderer {
	public void render(final Row row, final Object data) {
		final Rows rows = (Rows)row.getParent();
		final Grid grid = (Grid)rows.getParent();
		final Template tm = grid.getTemplate("model");
		if (tm == null) {
			final Label label = newRenderLabel(Objects.toString(data));
			label.applyProperties();
			label.setParent(row);
			row.setValue(data);
		} else {
			//will call into BindUiLifeCycle#afterComponentAttached, and apply binding management there
			final String varnm = (String) grid.getAttribute(BinderImpl.VAR); //see BinderImpl#initRendererIfAny
			final Component[] items = tm.create(rows, row,
				new VariableResolverX() {
					public Object resolveVariable(String name) {
						//shall never call here
						return varnm.equals(name) ? data : null;
					}

					public Object resolveVariable(XelContext ctx, Object base, Object name) throws XelException {
						if (base == null) {
							return varnm.equals(name) ? data : null;
						} else if (base.equals(data)) {
							return "index".equals(name) ? Integer.valueOf(row.getIndex()) : null;
						}
						return null;
					}
				}, null);
			if (items.length != 1)
				throw new UiException("The model template must have exactly one row, not "+items.length);

			final Row nr = (Row)items[0];
			nr.setAttribute(varnm, data); //kept the value
			
			if (nr.getValue() == null) //template might set it
				nr.setValue(data);
			row.setAttribute("org.zkoss.zul.model.renderAs", nr);
				//indicate a new row is created to replace the existent one
			row.detach();
		}
	}
	/** Returns the label for the cell generated by the default renderer.
	 */
	private static Label newRenderLabel(String value) {
		final Label label =
			new Label(value != null && value.length() > 0 ? value: " ");
		label.setPre(true); //to make sure &nbsp; is generated, and then occupies some space
		return label;
	}
}
