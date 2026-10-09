import React from 'react';

export type FilterCategory = 'All' | 'Unread' | 'Academic' | 'Projects' | 'System';

interface NotificationFilterProps {
  selectedFilter: FilterCategory;
  onSelectFilter: (category: FilterCategory) => void;
  unreadCount: number;
  totalCount: number;
}

export const NotificationFilter: React.FC<NotificationFilterProps> = ({
  selectedFilter,
  onSelectFilter,
  unreadCount,
  totalCount
}) => {
  const filterOptions: FilterCategory[] = ['All', 'Unread', 'Academic', 'Projects', 'System'];

  return (
    <div className="tab-filters-container">
      {filterOptions.map((filter) => {
        let badgeValue: number | null = null;
        if (filter === 'All') badgeValue = totalCount;
        if (filter === 'Unread') badgeValue = unreadCount;

        return (
          <button
            key={filter}
            className={`tab-filter-btn ${selectedFilter === filter ? 'active' : ''}`}
            onClick={() => onSelectFilter(filter)}
          >
            <span>{filter}</span>
            {badgeValue !== null && badgeValue > 0 && (
              <span className={`tab-filter-count ${filter === 'Unread' && unreadCount > 0 ? 'unread-count' : ''}`}>
                {badgeValue}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
