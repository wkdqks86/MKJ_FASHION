import {
  formatDateTime,
  formatPrice,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABELS,
  summarizeOrderItems,
} from '@/constants/adminData'
import AdminIconButton from '@/components/admin/common/AdminIconButton'
import { getOrdererName } from '@/utils/orderDisplay'

function RecentOrdersTable({ orders, onViewDetail, onDelete }) {
  const displayOrders = orders.slice(0, 8)

  return (
    <div className="admin-card">
      <h3 className="admin-card__title">최근 주문 현황</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문자</th>
              <th>상품</th>
              <th>결제금액</th>
              <th>주문일시</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order) => (
              <tr key={order._id}>
                <td>
                  <button
                    type="button"
                    className="admin-table__link"
                    onClick={() => onViewDetail(order)}
                  >
                    {order.orderNumber}
                  </button>
                </td>
                <td>{getOrdererName(order)}</td>
                <td>{summarizeOrderItems(order.items)}</td>
                <td>{formatPrice(order.totalAmount)}</td>
                <td>{formatDateTime(order.createdAt)}</td>
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
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentOrdersTable
