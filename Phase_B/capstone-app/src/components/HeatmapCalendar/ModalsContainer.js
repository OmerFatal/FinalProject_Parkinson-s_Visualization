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
      {/* Show modal for future dates if triggered */}
      {showFutureModal && (
        <FutureDateModal
          clickedDate={futureDateClicked}
          onClose={() => setShowFutureModal(false)}
        />
      )}

      {/* Show modal for days with no data */}
      {showNoDataModal && (
        <NoDataModal
          clickedDate={noDataClicked}
          onClose={() => setShowNoDataModal(false)}
        />
      )}
    </>
  );
}
