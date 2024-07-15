import { useState } from "react";
import { Web3Storage } from 'web3.storage';
import { useContract } from '../ContractContext';
// import {Redirect} from 'react-router-dom';

function CreateProjectComponent(props) {
    const { crowdfundingContract, selectedAccount  } = useContract();
    const [redirectToHome, setRedirectToHome] = useState(false);
    const [formInput, setFormInput] = useState({
        category: "",
        name: "",
        description: "",
        // creatorName: "",
        // image: "",
        // link: "",
        goal: 1,
        duration: 1,
        // refundPolicy: "",
    });
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [inputImage, setInputImage] = useState(null);


    // set the form input state if input changes
    function handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        formInput[name] = value;
        setFormInput(formInput);
    }

    // read the input image file provided and set its corresponding state
    async function handleImageChange(e) {
        // read the file content on change
        setInputImage(document.querySelector('input[type="file"]'));
        console.log(document.querySelector('input[type="file"]'));
    }

    // return category code
    // function getCategoryCode() {
    //     let categoryCode = {
    //         "Education": 0,
    //         "Animal": 1,
    //         "Disaster": 2,
    //         "Disease": 3,
    //         "Family": 4,
    //     };
    //     return categoryCode[formInput["category"]];
    // }


    const handleCreateProject = async (e) => {
        e.preventDefault();
        console.log(formInput)
        console.log(selectedAccount)
        console.log(crowdfundingContract)
        if (crowdfundingContract && selectedAccount > 0) {
            try {
                const res = await crowdfundingContract.methods.createProject(
                    formInput.name, formInput.description,formInput.category,
                    formInput.goal, formInput.duration * 60
                ).send({ from: selectedAccount });
                console.log(res)
                setMessage('Project created successfully!');
                setShowSuccessModal(true);
               // setTimeout(() => {
               //     setShowSuccessModal(false);
               //     setRedirectToHome(true)
               // }, 3000)
            } catch (error) {
                console.error('Error creating project:', error);
                setMessage('Failed to create project.');
            }
        } else {
            setMessage('Please connect to MetaMask.');
        }
    }
    // if (redirectToHome) {
    //     return <Link to="/" />;
    // }
    return (
        // onSubmit function to do further operation with form data --> not defined yet
        <div className="create-form">
            <form method="post" onSubmit={handleCreateProject} name="projectForm">
                <h1>Create Project</h1>
                <label>Category</label>
                <select name="category" required onChange={handleChange}>
                    <option value="" selected disabled hidden>
                        Select category
                    </option>
                    <option value="Education">Education</option>
                    <option value="Animal">Animal</option>
                    <option value="Disaster">Disaster</option>
                    <option value="Disease">Disease</option>
                    <option value="Family">Family</option>
                </select>
                <label>Project Name</label>
                <input
                    name="name"
                    placeholder="Enter the project name"
                    required
                    onChange={handleChange}
                />
                <label>Project Description</label>
                <textarea
                    name="description"
                    placeholder="Enter project description"
                    cols="50"
                    rows="5"
                    required
                    onChange={handleChange}
                />
                {/*<label>Upload Project Image</label>*/}
                {/*<input*/}
                {/*    type="file"*/}
                {/*    name="image"*/}
                {/*    accept="image/*"*/}
                {/*    onChange={handleImageChange}*/}
                {/*/>*/}
                {/*<p className="caution">*Image of resolution 1920x1080 is preffered for better display</p>*/}

                <label>Funding Goal (CFT)</label>
                <input
                    type="number"
                    step="1"
                    name="goal"
                    placeholder="Enter the funding goal"
                    min="1"
                    required
                    onChange={handleChange}
                />
                <label>Duration (Days)</label>
                <input
                    type="number"
                    name="duration"
                    placeholder="Enter the duration for the funding"
                    min="1"
                    required
                    onChange={handleChange}
                />
                <input type="submit" className="submitButton" value="Submit" />
            </form>
            {message && <p>{message}</p>}
            {showSuccessModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Project Created Successfully!</h2>
                        <p>Redirecting to home page...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateProjectComponent;
