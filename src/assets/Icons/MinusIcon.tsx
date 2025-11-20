import React from "react";

import { MyIconProps } from "./interface";

const MinusIcon: React.FC<MyIconProps> = (props) => {
    return (
        <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect fill="#BCBFC2" height="2" rx="1" width="14" x="3" y="9" />
        </svg>
    );
};

export default MinusIcon;
