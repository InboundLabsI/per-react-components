import React from 'react'

const PhoneIcon = () => {
    return (
        <svg
            width={17}
            height={17}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g clipPath="url(#a)">
            <path fill="url(#b)" d="M-2-2h21v21H-2z" />
            </g>
            <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h17v17H0z" />
            </clipPath>
            <pattern
                id="b"
                patternContentUnits="objectBoundingBox"
                width={1}
                height={1}
            >
                <use xlinkHref="#c" transform="scale(.00333)" />
            </pattern>
            <image
                id="c"
                width={300}
                height={300}
                xlinkHref="data:image/png;base64,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"
            />
            </defs>
        </svg>

    )
}

export default PhoneIcon


