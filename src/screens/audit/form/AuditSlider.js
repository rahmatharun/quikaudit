import React, { Component } from 'react';
export default class AuditSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    render() {
        const { data, renderItem, finalSlide } = this.props
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {data.map((item, index) =>
                    <div className="swiper-slide">
                       {renderItem(item.items)}
                       </div>
                    )}
                    <div className="swiper-slide">
                       {finalSlide()}
                       </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        // eslint-disable-next-line
        this.mySwiper = new Swiper('.swiper-container', {
            speed: 300,
        });

        this.mySwiper.on('slideChangeTransitionEnd',  ()=> {
            this.props.onChange(this.mySwiper.activeIndex)
          });
    }
    componentDidUpdate(prevProps) {
        if (this.props.activeIndex !== prevProps.activeIndex && this.mySwiper.activeIndex!==this.props.activeIndex) {
            this.mySwiper.slideTo(this.props.activeIndex);
        }
      }

}

