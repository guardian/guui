import React from "react";

export const AmpAnimation: React.FC<{ id?: string, animationRules: any }> = ({ id, animationRules }) => {
    const innerHtml = {
        __html: `
            <amp-animation trigger='visibility' layout='nodisplay' id=${id}>
              <script type="application/json">
                ${JSON.stringify(animationRules)}
              </script>
            </amp-animation>
        `
    }

    return (
        <div dangerouslySetInnerHTML={innerHtml} />
    )
}
