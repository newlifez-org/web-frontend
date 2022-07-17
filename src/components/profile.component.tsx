import { Component } from "react";
import { Redirect } from "react-router-dom";
import IUser from "../types/user.type";
import UserService from "../services/user.service";

type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
  currentUser: IUser & { accessToken: string },
  nft: any
}
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleProfile = this.handleProfile.bind(this);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { accessToken: "" },
      nft: []
    };

  }

  componentDidMount() {
    this.handleProfile();
  }

  handleProfile() {
    UserService.getUserProfile().then(async (data : any) => {
      let nftInfo: any = [];
      if(data.data.list_tokens) {
        for (const item of data.data.list_tokens) {
          const nft = await UserService.getNFTDetail(item.token_uri);
          nftInfo.push({
            id: item.token_id,
            image: nft.data.image,
            description: nft.data.description,
            name: nft.data.name,
          })
        }
        this.setState({nft : nftInfo});
      }
    }, error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.setState({ redirect: "/login" });
      }
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const {nft} = this.state;
    return (
      <div className="container">
        <div id="your-nft">
          <span>Your Collection</span>
        </div>
        <div id="character-list">
          <div id="list-item" className="row col-12">
            {nft.map((item: any) => (
              <div key="{item}" className="col-md-3 col-6 view-item view-active">
                <div className="view-detail">
                  <div className="character-detail-bg-1-list">
                  </div>
                  <div className="character-detail-bg-2-list">
                  </div>
                  <div className="character-detail-bg-3-list">
                    <div className="character-detail-content">
                      <div className="character-content">
                        <div className="background-price">
                          <div className="tag-name">
                            <span>{item.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item-character-list">
                    <img className="item-character-bg" src="./assets/images/Mask_Group_41.png"/>
                    <div className="item">
                      <img className="image-character" src={item.image}/>
                    </div>
                  </div>
                </div>
                <div className="stage-item">
                  <img className="stage-character" src="./assets/images/stage.png"/>
                </div>
              </div>
            ))} 
          </div>
        </div>
      </div>
    );
  }
}
