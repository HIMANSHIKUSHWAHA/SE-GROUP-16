import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminMetrics() {
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/admin/metrics');
        setMetrics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Admin Metrics</h2>
      <p>Total Users: {metrics.userCount}</p>
      {/* Display metrics here */}
    </div>
  );
}

export default AdminMetrics;
