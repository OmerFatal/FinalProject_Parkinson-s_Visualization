import React from 'react';
import FutureDateModal from './FutureDateModal';
import NoDataModal from './NoDataModal';

export default function ModalsContainer({
  showFutureModal,
  setShowFutureModal,
  futureDateClicked,
  showNoDataModal,
  setShowNoDataModal,
  noDataClicked
}) {
  return (
    <>
      {showFutureModal && (
        <FutureDateModal
          clickedDate={futureDateClicked}
          onClose={() => setShowFutureModal(false)}
        />
      )}
      {showNoDataModal && (
        <NoDataModal
          clickedDate={noDataClicked}
          onClose={() => setShowNoDataModal(false)}
        />
      )}
    </>
  );
}
