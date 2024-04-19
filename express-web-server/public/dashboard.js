// import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

document.addEventListener('DOMContentLoaded', function() {
    const sdk = new ChartsEmbedSDK({
        baseUrl: 'https://charts.mongodb.com/charts-myiot-rweli' // Replace with your actual URL
    });

    const dashboard = sdk.createDashboard({
        dashboardId: '191c2c64-3fef-4266-a66c-d8d011294bf4', // Replace with your actual Dashboard ID
        // height: "600px"
    });

    dashboard.render(document.getElementById('dashboard-container')).catch(err => console.error('Error loading the dashboard:', err));
});
