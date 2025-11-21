import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';

const renderServiceCard = (service) => {
  return render(
    <BrowserRouter>
      <ServiceCard service={service} />
    </BrowserRouter>
  );
};

describe('ServiceCard Component', () => {
  const mockService = {
    id: 1,
    name: 'Salle de réunion A',
    type: 'room',
    description: 'Grande salle avec projecteur',
    slots: ['2025-01-15 10:00', '2025-01-15 14:00', '2025-01-16 09:00'],
  };

  it('should render service name', () => {
    renderServiceCard(mockService);
    
    expect(screen.getByText('Salle de réunion A')).toBeInTheDocument();
  });

  it('should render service description', () => {
    renderServiceCard(mockService);
    
    expect(screen.getByText('Grande salle avec projecteur')).toBeInTheDocument();
  });

  it('should render service type badge', () => {
    renderServiceCard(mockService);
    
    expect(screen.getByText('Salle')).toBeInTheDocument();
  });

  it('should render correct type for equipment', () => {
    const equipmentService = {
      ...mockService,
      type: 'equipment',
    };

    renderServiceCard(equipmentService);
    
    expect(screen.getByText('Équipement')).toBeInTheDocument();
  });

  it('should render correct type for other', () => {
    const otherService = {
      ...mockService,
      type: 'other',
    };

    renderServiceCard(otherService);
    
    expect(screen.getByText('Autre')).toBeInTheDocument();
  });

  it('should display number of slots', () => {
    renderServiceCard(mockService);
    
    expect(screen.getByText('3 créneaux disponibles')).toBeInTheDocument();
  });

  it('should display "Voir l\'agenda" button', () => {
    renderServiceCard(mockService);
    
    expect(screen.getByText('Voir l\'agenda')).toBeInTheDocument();
  });

  it('should handle service without description', () => {
    const serviceWithoutDesc = {
      ...mockService,
      description: undefined,
    };

    renderServiceCard(serviceWithoutDesc);
    
    expect(screen.getByText('Salle de réunion A')).toBeInTheDocument();
    expect(screen.queryByText('Grande salle avec projecteur')).not.toBeInTheDocument();
  });

  it('should handle service with no slots', () => {
    const serviceNoSlots = {
      ...mockService,
      slots: [],
    };

    renderServiceCard(serviceNoSlots);
    
    expect(screen.getByText('0 créneaux disponibles')).toBeInTheDocument();
  });
});
