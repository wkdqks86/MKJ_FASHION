import './Footer.css'

const FOOTER_LINKS = ['사이트 가이드 체험', 'NEW', '디자인번호', '바로가기', 'LIFE', 'SALE']

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <nav className="footer__links">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" className="footer__link">
              {link}
            </a>
          ))}
        </nav>
        <p className="footer__copy">© MKJ FASHION Co., Ltd.</p>
      </div>
    </footer>
  )
}

export default Footer
