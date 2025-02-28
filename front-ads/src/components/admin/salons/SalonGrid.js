import { SalonCard } from './SalonCard';

export const SalonGrid = ({ salons, onView, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {salons.map((salon) => (
        <SalonCard 
          key={salon.id} 
          salon={salon}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};