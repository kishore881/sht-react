import React, { Component } from 'react'
import TrendDeck from './TrendDeck'
import axios from 'axios'


export default class Trends extends Component {
    state={
        region:'',
        trends:[],
        error:'',
        loading:false
    }

    handleChange =(e)=>{
        this.setState({region:e.target.value})
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        let region = e.target[0].value;
        this.props.history.push("/trends?region="+region);
    };

    getTrends = (region)=>{
        let url = 'https://support-hashtag.herokuapp.com/trends?region='+region;
        this.setState({region, trends:[], error:'', loading:true});
        axios.get(url).then((response)=>{
            let curReg = new URLSearchParams(this.props.location.search).get("region")
            if(response.data.region.toLowerCase() !== curReg.toLowerCase()){
                return;
            }
            if(response.data.region && response.data.trends){
                let trends = response.data.trends.map((trend)=>{
                    return {name: trend.name, vol: trend.tweet_volume};
                });
                this.setState({trends, region: response.data.region, error: response.data.msg,loading:false});
            }else if(response.data.msg){
                this.setState({error:'Error encountered, check the spelling or try again in few minutes.',loading:false})
            }
        }).catch(()=>{
            this.setState({error: 'Check your network connection and Try again', loading:false});
        });
    }

    getAction = ()=>{
        if(this.state.loading)
            return <div className="spinner-border text-primary" role="status"></div>
        else
            return <button type="submit" className="btn btn-primary w-25">Go</button>
    }

    componentDidUpdate(prevProps) {
        let prevLoc = new URLSearchParams(prevProps.location.search).get("region");
        let curLoc = new URLSearchParams(this.props.location.search).get("region");
        if(prevLoc !== curLoc){
            this.getTrends(curLoc);
        }
    }

    componentDidMount(){
        let region = new URLSearchParams(this.props.location.search).get("region");
        if(region){
            this.getTrends(region);
        }
    }

    render() {
        return (
            <div className="container-xl flex-grow-1">
                <div className="py-4">
                    <form id="trend-form" onSubmit={this.handleSubmit}>
                        <div className="w-sm-100 w-75 mx-auto">
                            <label className="control-label">Search Twitter:</label>
                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" name="region" placeholder="City or Country" required value={this.state.region} onChange={this.handleChange}/>
                                </div>
                            </div>
                            
                            <h6 className="text-center my-4"><strong>Enter a City or Country</strong> in the above field and <strong>Hit Go</strong> to see Twitter Trends in the region</h6>

                            <div className="d-flex justify-content-center">
                                {this.getAction()}
                            </div>
                        </div>
                    </form>
                </div>
                {
                    this.state.trends.length ? 
                    <TrendDeck trends={this.state.trends} region={this.state.region}/> :
                    <h4 className="text-center">{this.state.error}</h4>
                }
            </div>
        )
    }
}