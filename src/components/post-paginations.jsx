import React from "react";

const PostPaginations = () => {
  return (
    <ul className="list-unstyled post-pagination d-flex justify-content-center align-items-center">
      <li>
        <a href="#none">
          <i className="far fa-angle-left"></i>
        </a>
      </li>
      <li>
        <a href="#none">01</a>
      </li>
      <li>
        <a href="#none">02</a>
      </li>
      <li>
        <a href="#none">03</a>
      </li>
      <li>
        <a href="#none">
          <i className="far fa-angle-right"></i>
        </a>
      </li>
    </ul>
  );
};

export default PostPaginations;
