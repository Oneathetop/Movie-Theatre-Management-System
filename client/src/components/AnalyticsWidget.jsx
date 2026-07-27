const AnalyticsWidget = ({ metrics }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px', textAlign: 'center', minWidth: '140px', border: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>{metrics?.totalTicketsSold}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Tickets Sold</div>
      </div>
      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px', textAlign: 'center', minWidth: '140px', border: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e64a19' }}>{metrics?.capacityUtilizationRate}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Capacity Utilization</div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
