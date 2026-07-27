import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnalyticsCharts = ({ reportData, metrics }) => {
  
  // Normalize analytics rows from either aggregated revenue endpoint or legacy showtime-like data.
  const revenueChartData = reportData.map(item => {
    const movieTitle = item._id || item.movieId?.title || 'Unknown Film';
    const ticketsSoldCount = Number(item.seatsReservedTotal ?? item.reservedSeats?.length ?? 0);
    const calculatedRevenue = Number(item.totalRevenueGenerated ?? (ticketsSoldCount * (item.basePrice || 0)));

    return {
      name: movieTitle,
      revenue: calculatedRevenue,
      tickets: ticketsSoldCount
    };
  });

  const rawPercentage = metrics ? parseFloat(metrics.capacityUtilizationRate) : 0;
  
  // 🚀 CRUCIAL FIX: Generate a unique dynamic key based on total tickets sold.
  // This forces the chart layout to redraw itself instantly when a seat is purchased.
  const chartRefreshKey = metrics ? metrics.totalTicketsSold : 0;

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '32px', marginBottom: '32px', fontFamily: 'sans-serif' }}>
      
      {/* Panel A: Financial Performance Yield Graph */}
      <div style={{ flex: '2', minWidth: '350px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>Revenue Yield Analysis</h4>
        
        {/* 🚀 FIXED: Replaced ResponsiveContainer with fixed parameters to prevent 0px width bugs */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BarChart 
            key={chartRefreshKey} 
            width={450} 
            height={260} 
            data={revenueChartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
            <YAxis stroke="#666" fontSize={12} tickLine={false} />
            <Tooltip cursor={{ fill: '#f5f5f5' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            {/* 🚀 FIXED: Kept lower-case keys for data mapping, display titles handled via 'name' attribute */}
            <Bar dataKey="revenue" fill="#2e7d32" name="Gross Revenue ($)" barSize={40} />
            <Bar dataKey="tickets" fill="#1976d2" name="Tickets Sold" barSize={40} />
          </BarChart>
        </div>
      </div>

      {/* Panel B: Executive Capacity Utilization Gauge Block */}
      <div style={{ flex: '1', minWidth: '250px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>Capacity Tracking</h4>
          <p style={{ color: '#888', fontSize: '12px', margin: '0 0 24px 0' }}>Live screening utilization metrics</p>
        </div>
        
        <div style={{ textAlign: 'center', margin: 'auto 0' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: rawPercentage >= 75 ? '#d32f2f' : '#e64a19', lineHeight: '1' }}>
            {metrics?.capacityUtilizationRate || '0%'}
          </div>
          <p style={{ fontSize: '13px', color: '#555', fontWeight: '500', marginTop: '12px', marginBottom: '24px' }}>
            Theater Seats Filled
          </p>
        </div>

        {/* Linear progress track container */}
        <div style={{ background: '#eee', height: '10px', borderRadius: '5px', overflow: 'hidden', width: '100%' }}>
          <div 
            style={{ 
              width: `${rawPercentage}%`, 
              background: rawPercentage >= 75 ? '#d32f2f' : '#e64a19', 
              height: '100%', 
              transition: 'width 0.5s ease-in-out' 
            }} 
          />
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
