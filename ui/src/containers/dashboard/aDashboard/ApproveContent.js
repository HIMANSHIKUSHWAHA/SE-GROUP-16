import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApproveContent() {
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/admin/content-to-approve');
        setContentList(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching content: ' + err.message);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleApproval = async (contentId, isApproved) => {
    try {
      const url = `/api/admin/${isApproved ? 'approve' : 'reject'}-content/${contentId}`;
      await axios.post(url);

      // Update the UI to reflect the approval/rejection
      setContentList(currentList =>
        currentList.filter(content => content.id !== contentId)
      );
    } catch (err) {
      setError('Error updating content: ' + err.message);
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading content...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {contentList.length > 0 ? (
        contentList.map(content => (
          <div key={content.id}>
            <h3>{content.title}</h3>
            {/* Display other content details here */}
            <button onClick={() => handleApproval(content.id, true)}>
              Approve
            </button>
            <button onClick={() => handleApproval(content.id, false)}>
              Reject
            </button>
          </div>
        ))
      ) : (
        <p>No content to approve.</p>
      )}
    </div>
  );
}

export default ApproveContent;
