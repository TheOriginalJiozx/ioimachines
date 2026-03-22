package com.ioimachines.backend.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;

@Embeddable
public class ModalTextEntry {
    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "icon_key")
    private String iconClass;

    public ModalTextEntry() {}
    public ModalTextEntry(String body, String iconClass, Integer orderIndex) {
        this.body = body;
        this.iconClass = iconClass;
        this.orderIndex = orderIndex;
    }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getIconClass() { return iconClass; }
    public void setIconClass(String iconClass) { this.iconClass = iconClass; }
    @Column(name = "order_index")
    private Integer orderIndex;

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
