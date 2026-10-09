import React from 'react';
import { FileCheck, Award, ShieldAlert, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';
import type { ServiceTypeItem } from '../data/studentServices';

interface ServiceCardProps {
  service: ServiceTypeItem;
  onSelectService: (service: ServiceTypeItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'FileCheck':
        return <FileCheck size={24} className="text-orange" />;
      case 'Award':
        return <Award size={24} className="text-blue" />;
      case 'ShieldAlert':
        return <ShieldAlert size={24} className="text-orange" />;
      case 'MessageSquare':
        return <MessageSquare size={24} className="text-blue" />;
      case 'HelpCircle':
      default:
        return <HelpCircle size={24} className="text-orange" />;
    }
  };

  return (
    <div className="service-card-item">
      <div className="service-icon-header">
        <div className="service-icon-bg">
          {getIcon(service.iconName)}
        </div>
        <span className="badge badge-secondary font-mono" style={{ fontSize: '0.7rem' }}>
          {service.category}
        </span>
      </div>

      <h3 className="service-title">{service.title}</h3>
      <p className="service-description font-sans">{service.description}</p>

      <div className="service-card-footer">
        <span className="font-mono text-dark-grey" style={{ fontSize: '0.75rem' }}>
          Est: {service.estimatedTime}
        </span>

        <button 
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          onClick={() => onSelectService(service)}
        >
          <span>Apply / Request</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
