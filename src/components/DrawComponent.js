const DRAW_UNITS_TO_USER_UNITS = (1.0 / 640.0) * (4.0 / 3.0);

function DrawComponent({drawFile}) {
    if (!drawFile) {
        return <div/>;
    }

    const {
        boundingBox: {minX, maxX, minY, maxY},
        objects
    } = drawFile;

    const width = Math.max(maxX - minX, 1);
    const height = Math.max(maxY - minY, 1);

    const screenWidth = width * DRAW_UNITS_TO_USER_UNITS;
    const screenHeight = height * DRAW_UNITS_TO_USER_UNITS;

    const sx = screenWidth / width;
    const sy = screenHeight / height;

    const transform = [sx, 0, 0, -sy, -sx * minX, sy * maxY];

    return (
        <div>
            <svg width={screenWidth} height={screenHeight}>
                <g transform={`matrix(${transform})`}>
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