import React, { useState } from 'react'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { HeartHeadGovernanceContract } from '../../contract';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { apiEndPoint } from '../../routes/routes';
import { ethers } from 'ethers';
import './proposal.scss'


function ProposalCreate() {
  const history = useHistory()
  const location = useLocation();
  const { library } = useActiveWeb3React();
  const [proposal, setProposal] = useState({
    title: '',
    description: '',
    discussionURL: '',
    loading: false
  });
  const [fileRatio, setFileRatio] = useState(1);
  const [file, setFile] = useState(null);
  const [newProposalPicSrc, setNewProposalPicSrc] = useState("");



  // if(!proposal?.title && !proposal?.description && !proposal?.discussionURL) return
  const formData = new FormData()

  async function handleClickCreateProposal() {
    if(!file){
      return toast.error(
        "image is require!",
        {
          duration: 4000,
          iconTheme: {
            primary: "#007bff",
            secondary: "#cce5ff",
          },
        }
      );
    }
    let response;
    let publishData;
    try {
      setProposal(prevState => ({
        ...prevState,
        loading: true
      }));
      let governace = await HeartHeadGovernanceContract(library);
      const data = `${proposal.title}\n${proposal.description}`;

      const descriptionHash = ethers.utils.id(data);
      let preProposalId = await governace.hashProposal(["0x0000000000000000000000000000000000000000"], [0], ["0x"], descriptionHash);
      let proposalId = preProposalId.toString()
      formData.append('proposalId', proposalId)
      formData.append('discussionUrl', proposal?.discussionURL)
      formData.append('image', file)

      if (proposalId) {
        response = await axios.post(
          `${process.env.REACT_APP_API}/${apiEndPoint.CREATE_PROPOSAL}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        );
      }
      if (response?.status === 200) {
        publishData = await governace.propose(["0x0000000000000000000000000000000000000000"], [0], ["0x"], data);
      }
      await publishData.wait(1);

      toast.success(
        "Proposal create successfully!",
        {
          duration: 4000,
          iconTheme: {
            primary: "#007bff",
            secondary: "#cce5ff",
          },
        }
      );

      setProposal(prevState => ({
        ...prevState,
        loading: false,
        title: "",
        description: ""
      }));
      history.push('/proposal-list')
    } catch (error) {
      console.log('error publish 1612', error);
      setProposal(prevState => ({
        ...prevState,
        loading: false
      }));
    }
  }

  const handleUploadProposalImage = (event) => {
    if (event.target.files) {
      if (event.target.files[0].size > 4e6) {
        toast.error('The asset should not be more than 4MB')
        event.target.value = ''
        return
      }
      const fileType = event.target.files[0].type.split("/")[0];
      if (fileType === "image") {
        setFile(event.target.files[0]);
        var img = new Image();
        img.src = URL.createObjectURL(event.target.files[0]);
        img.onload = function () {
          URL.revokeObjectURL(img.src);
          setFileRatio(img.height / img.width)
        }
      } else {
        toast.error("Unsupported Type")
      }
    }
  }
  const handleTitleChange = (e) => {
    setProposal(prevState => ({
      ...prevState,
      title: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    setProposal(prevState => ({
      ...prevState,
      description: e.target.value
    }));
  };

  const handleDiscussionURLChange = (e) => {
    setProposal(prevState => ({
      ...prevState,
      discussionURL: e.target.value
    }));
  };

  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
          <div className='back-button'>
            <Link to='/proposal-list'>
              Back
            </Link>
          </div>
          <div className='voting-block-title'>
            <div className='text-dicription-block'>

              <h2>New Proposal</h2>
              <p className='block-p-mt'>
                {location?.state?.member || 0} Members <span>Joined</span>
              </p>
            </div>
            <div className='button-group-voting'>
              <button className='voting-block-btn btn' onClick={handleClickCreateProposal}>{proposal.loading ? "Loading..." : "Publish"}</button>
            </div>
          </div>
          <div className='voting-form'>
            <form>
              <div className='form-group'>
                <label>Title</label>
                <input type='text' placeholder='Enter the title of your Proposal' value={proposal.title} onChange={handleTitleChange}></input>
              </div>
              <div className='form-group'>
                <label>Description</label>
                <textarea placeholder='Enter Description' value={proposal.description} onChange={handleDescriptionChange}></textarea>
              </div>
              <div className='form-group'>
                <label>Discussion URL</label>
                <input type='text' placeholder='Enter the discussion url of your Proposal' value={proposal.discussionURL} onChange={handleDiscussionURLChange}></input>
              </div>
              <div className="form-group ">
              <label>Image Upload</label>

                <div className='image-container'>
                  <label htmlFor="choose-file">
                    <img
                      src={(file ? URL.createObjectURL(file) : newProposalPicSrc) || "/upload.svg"}
                      alt=''
                      className='img'
                    />
                  </label>
                  <input
                    id="choose-file"
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={handleUploadProposalImage}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalCreate;
