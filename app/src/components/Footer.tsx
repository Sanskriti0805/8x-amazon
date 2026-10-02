export default function Footer() {
  return (
    <footer>
      <div className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </div>
      <div className="footer">
        <div className="wrap">
          <div className="footer-cols">
            <div>
              <h5>Get to Know Us</h5>
              <a href="#">Careers</a>
              <a href="#">About Amazon</a>
              <a href="#">Press Releases</a>
            </div>
            <div>
              <h5>Make Money with Us</h5>
              <a href="#">Sell on Amazon</a>
              <a href="#">Become an Affiliate</a>
              <a href="#">Advertise Your Products</a>
            </div>
            <div>
              <h5>Let Us Help You</h5>
              <a href="#">Your Account</a>
              <a href="#">Your Orders</a>
              <a href="#">Shipping Rates</a>
              <a href="#">Help</a>
            </div>
          </div>
          <div className="logo" style={{ color: '#fff' }}>
            amazon<span className="smile">.</span>
          </div>
          <p className="note" style={{ color: '#999', marginTop: 12 }}>
            A rebuild for the 8x assignment. Not affiliated with Amazon. No real orders or payments.
          </p>
        </div>
      </div>
    </footer>
  )
}
