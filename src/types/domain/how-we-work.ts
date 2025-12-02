import React from "react";

export interface CardItem {
    title: string;
    text: string;
    bgClass?: string;
    textColor: string;
    pColor: string;
    icon: React.ReactNode;
}
