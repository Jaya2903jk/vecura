import { useEffect } from "react";
import Chart from 'chart.js/auto';

export default function Dashboard() {
//   useEffect(() => {
//     // Chart initialization
//     const ctx1 = document.getElementById('salesChart').getContext('2d');
//     new Chart(ctx1, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//         datasets: [{
//           label: 'Sales',
//           data: [12, 19, 3, 5, 2, 3],
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       }
//     });

//     const ctx2 = document.getElementById('revenueChart').getContext('2d');
//     new Chart(ctx2, {
//       type: 'bar',
//       data: {
//         labels: ['Q1', 'Q2', 'Q3', 'Q4'],
//         datasets: [{
//           label: 'Revenue',
//           data: [65, 59, 80, 81],
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       }
//     });
//   }, []);

  return (
    <div className="page-inner">

      {/* HEADER */}
      <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
        <div>
          <h3 className="fw-bold mb-3">Dashboard</h3>
         
        </div>

        <div className="ms-md-auto py-2 py-md-0">
          <button className="btn btn-label-info btn-round me-2">
            Manage
          </button>
          <button className="btn btn-primary btn-round">
            Add Customer
          </button>
        </div>
      </div>

      {/* CARDS SECTION */}
      <div className="row">
        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-primary bubble-shadow-small">
                    <i className="fas fa-users"></i>
                  </div>
                </div>

                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Visitors</p>
                    <h4 className="card-title">1,294</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-success bubble-shadow-small">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                </div>

                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Sales</p>
                    <h4 className="card-title">$ 1,345</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-warning bubble-shadow-small">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>

                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Orders</p>
                    <h4 className="card-title">576</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-secondary bubble-shadow-small">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>

                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Revenue</p>
                    <h4 className="card-title">$ 2,345</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Sales Overview</div>
            </div>
            <div className="card-body">
              <canvas id="salesChart"></canvas>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Revenue by Quarter</div>
            </div>
            <div className="card-body">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
