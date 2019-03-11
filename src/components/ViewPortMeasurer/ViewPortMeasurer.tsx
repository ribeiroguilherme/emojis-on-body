import * as React from 'react';
import './ViewPortMeasurer.css';

interface State {
    isMeasured: boolean;
    height: number;
    width: number;
}

interface Props {
    children: (width: number, height: number) => JSX.Element;
}

class ViewPortMeasurer extends React.PureComponent<Props, State> {

    private viewPortRef = React.createRef<HTMLDivElement>();

    state: Readonly<State> = {
        isMeasured: false,
        height: null,
        width: null,
    };

    constructor(props: Props) {
        super(props);
        window.addEventListener('resize', this.measureViewport);
    }

    componentDidMount() {
        this.measureViewport();
    }

    measureViewport = () => {
        const { height, width } = this.viewPortRef.current.getBoundingClientRect();

        this.setState({
            height,
            width,
            isMeasured: true,
        });
    }

    render() {
        const { isMeasured, height, width } = this.state;

        return (
            <div ref={this.viewPortRef} className="view-port-measurer">
                {
                    isMeasured &&
                        this.props.children(height, width)
                }
            </div>
        );
    }

}

export default ViewPortMeasurer;
