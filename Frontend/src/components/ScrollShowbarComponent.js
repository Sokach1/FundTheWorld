import { Link } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import dummyPic from "../assets/pg1.jpg";

function ScrollShowbarComponent(props) {
  const scroll = (val) => {
    document.getElementsByClassName("recentUploadsContainer")[0].scrollLeft +=
      val;
  };
    const getImagePath = (id) => {
        console.log(id)
        try {
            return require(`../assets/images/${id}.jpg`); // adjust the path if necessary
        } catch (error) {
            console.warn(`Image for ${id} not found, using dummy image`);
            return dummyPic;
        }
    };
  const renderCards = () => {
    return props.recentUploads.map((project, index) => {
      return (
        <div className="projectCard" key={index}>
          <Link to="/project" state={{ projectId: project.index }}>
            <div
              className="cardImg"
              style={{
                  backgroundImage: project.index!==null
                      ? `url(${getImagePath(project.index)})`
                      : dummyPic,
              }}
            />
          </Link>
          <div className="cardDetail">
            <div className="cardTitle">
              <Link to="/project" state={{ projectId: project.index }}>
                {project.name}
              </Link>
            </div>
            <div className="cardDesc">{project.description}</div>
            <div className="cardAuthor">{"By " + project.creator}</div>
          </div>
        </div>
      );
    });
  };
  return (
    <div className="recentUploads">
      <div className="recentUploadsHeader">
        <div className="recentUploadsHeading">{props.heading}</div>
        {props.recentUploads.length ? (
          <div className="scrollButtons">
            <BsArrowLeftCircle
              className="scrollNavBtn"
              onClick={() => scroll(-300)}
            />
            <BsArrowRightCircle
              className="scrollNavBtn"
              onClick={() => scroll(300)}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="recentUploadsContainer">
        {props.recentUploads.length ? (
          renderCards()
        ) : (
          <div className="noProjects">{props.emptyMessage}</div>
        )}
      </div>
    </div>
  );
}

export default ScrollShowbarComponent;
