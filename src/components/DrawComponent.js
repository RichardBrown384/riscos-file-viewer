const DRAW_UNITS_TO_USER_UNITS = (1.0 / 640.0) * (4.0 / 3.0);

function DrawComponent({drawFile}) {
    if (!drawFile) {
        return <div/>;
    }

    const {
        boundingBox: {minX, maxX, minY, maxY},
        objects
    } = drawFile;

    const viewBoxWidth = Math.max(maxX - minX, 1);
    const viewBoxHeight = Math.max(maxY - minY, 1);

    const viewBox = [minX, -maxY, viewBoxWidth, viewBoxHeight];

    const width = viewBoxWidth * DRAW_UNITS_TO_USER_UNITS;
    const height = viewBoxHeight * DRAW_UNITS_TO_USER_UNITS;

    return (
        <div>
            <svg width={width} height={height} viewBox={`${viewBox.join(' ')}`}>
                <g transform='scale(1,-1)'>
                    {objects.map((path, index) => {
                        const {tag: Tag, ...objectData} = path;
                        return <Tag {...objectData} key={index}/>
                    })}
                </g>
            </svg>
        </div>
    );
}

export default DrawComponent;