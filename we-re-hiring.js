const SPREADSHEET_ID = '10b5dhM1NpwHc1YIBNLE-lOSutdf4j70sALTYZuSS7QU';
const API_KEY = 'AIzaSyBBkSxoCYlIBB-Gs1y2vFbg_TEAeDVrvsA';
const SHEET_NAME = 'Jobs';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  fetchJobs();
});

async function fetchJobs() {
  const url = `https: //sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const headers = data.values[
            0
        ];
    const jobs = data.values.slice(1)
      .map(row => {
        const obj = {};
        headers.forEach((h,i) => obj[h
            ] = row[i
            ]);
        return obj;
        })
      .filter(job => job['Status'
        ] === 'TRUE' || job['Status'
        ] === true);

    renderJobs(jobs);
    } catch (err) {
    console.error('Error fetching jobs:', err);
    document.getElementById('job-list').innerHTML = '<p style="text-align:center;">Unable to load job listings at this time.</p>';
    }
}

function renderJobs(jobs) {
  const container = document.getElementById('job-list');
  container.innerHTML = '';
  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <h4>${job['Job Title'
            ]
        }</h4>
      <p><strong>Location:</strong> ${job['Location'
            ]
        } | <strong>Type:</strong> ${job['Employment Type'
            ]
        } | <strong>Hours:</strong> ${job['Working Hours'
            ]
        }</p>
      <p>${job['Job Summary'
            ]
        }</p>
      <button class="toggle-desc">View Details</button>
      <div class="full-desc">
        <p><strong>Requirements:</strong> ${job['Requirements'
            ]
        }</p>
        <p>${job['Full Description'
            ]
        }</p>
        <a href="${job['External Apply Link']}" class="btn-primary" target="_blank">Apply Now</a>
      </div>
    `;
    card.querySelector('.toggle-desc').addEventListener('click', () => {
      const desc = card.querySelector('.full-desc');
      desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
        });
    container.appendChild(card);
    });
}