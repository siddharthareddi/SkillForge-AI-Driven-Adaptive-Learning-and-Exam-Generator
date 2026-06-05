package com.skillforge.backend.payload.request;

public class GoogleProfile {
    private String email;
    private String name;
    private String sub;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSub() { return sub; }
    public void setSub(String sub) { this.sub = sub; }
}
