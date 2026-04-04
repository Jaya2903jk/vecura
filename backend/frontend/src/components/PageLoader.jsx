import React from "react";

const PageLoader = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.loaderBox}>
        <div className="spinner-border text-primary" role="status" />
        <p style={styles.text}>Loading, please wait...</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(4px)", // 🔥 pro glass effect
  },
  loaderBox: {
    textAlign: "center",
    color: "#fff",
    animation: "fadeIn 0.3s ease-in-out",
  },
  text: {
    marginTop: "10px",
    fontSize: "14px",
    letterSpacing: "1px",
  },
};

export default PageLoader;
