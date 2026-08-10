import {
  formatDateTime,
  formatPrice,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABELS,
  summarizeOrderItems,
} from '@/constants/adminData'
import AdminIconButton from '@/components/admin/common/AdminIconButton'
import { getOrdererName } from '@/utils/orderDisplay'

function OrderListTable({ orders, onViewDetail, onDelete, deletingOrderId }) {
  return (
    <div className="admin-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="전체 선택" /></th>
              <th>주문번호</th>
              <th>주문일시</th>
              <th>주문자명</th>
              <th>상품 요약</th>
              <th>총 결제금액</th>
              <th>주문 상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td><input type="checkbox" aria-label={`${order.orderNumber} 선택`} /></td>
                  <td>
                    <button
                      type="button"
                      className="admin-table__link"
                      onClick={() => onViewDetail(order)}
                    >
                      {order.orderNumber}
                    </button>
                  </td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td>{getOrdererName(order)}</td>
                  <td>{summarizeOrderItems(order.items)}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <span className={`admin-status ${ORDER_STATUS_CLASS[order.status] || ''}`}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-order-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--outline admin-btn--sm"
                        onClick={() => onViewDetail(order)}
                      >
                        상세보기
                      </button>
                      <AdminIconButton
                        variant="delete"
                        label="삭제"
                        onClick={() => onDelete?.(order)}
                        disabled={deletingOrderId === order._id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-pagination">
        <button type="button" className="admin-pagination__btn" aria-label="이전">‹</button>
        <button type="button" className="admin-pagination__btn admin-pagination__btn--active">1</button>
        <button type="button" className="admin-pagination__btn">2</button>
        <button type="button" className="admin-pagination__btn">3</button>
        <button type="button" className="admin-pagination__btn" aria-label="다음">›</button>
      </div>
    </div>
  )
}

export default OrderListTable
