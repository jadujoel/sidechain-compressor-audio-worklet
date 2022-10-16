import "./Circle.css"
export const Circle = () => {

    // function percentage(percent: number) {
    //     const offsets = 314.1593 - (percent * 2.3562)
    //     return offsets
    // }
    // const x: SVGElement

    // const offset = percentage(10)

    // $(".percentage").animate({
    //     "stroke-dashoffset":offset,
    // }, 3000)

    // if (offset >= 236) {
    //     $(".percentage").css("stroke","red")
    // }
    // else if (offset < 236 && offset >= 158) {
    //     $(".percentage").css("stroke","orange")
    // }
    // else if (offset < 158) {
    //     $(".percentage").css("stroke","green")
    // }

    // const anime = {
    //     animate: {
    //         "stroke-dashoffset": offset
    //     },
    //     stroke: "orange"
    // }

    // const style = JSON.parse(JSON.stringify(anime))

    return (
        // <svg height="68px" width="68px"><circle cx="34" cy="34" r="30"/></svg>
        <svg className="knob track fill"
            x="0px" y="0px" width="120px" height="120px">
            <circle className="knob track fill"
                cx="60" cy="60" r="50"
            />
        </svg>
    )
}
