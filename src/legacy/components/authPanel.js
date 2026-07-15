import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth, hasFirebaseCredentials } from "../services/firebaseConfig.js";
import { showSystemNotification } from "../main.js";

export function initAuthUI() {
  const modal = document.getElementById("auth-modal");
  const card = document.getElementById("auth-modal-card");
  const closeBtn = document.getElementById("btn-close-auth-modal");
  const tabLogin = document.getElementById("auth-tab-login");
  const tabSignup = document.getElementById("auth-tab-signup");
  const formLogin = document.getElementById("auth-form-login");
  const formSignup = document.getElementById("auth-form-signup");
  const errorMsg = document.getElementById("auth-error-msg");

  if (!modal || !card) return;

  // Global window functions to open/close
  window.appOpenAuthModal = (isBlocking = false) => {
    const closeBtn = document.getElementById("btn-close-auth-modal");
    if (closeBtn) {
      closeBtn.style.display = isBlocking ? "none" : "block";
    }
    modal.style.display = "flex";
    setTimeout(() => {
      modal.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 10);
  };

  window.appCloseAuthModal = () => {
    modal.style.opacity = "0";
    card.style.transform = "translateY(-20px)";
    setTimeout(() => {
      modal.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";
    }, 300);
  };

  closeBtn?.addEventListener("click", window.appCloseAuthModal);

  // Tab switching
  tabLogin?.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabLogin.style.borderBottom = "2px solid var(--accent-1)";
    tabLogin.style.color = "var(--text-primary)";
    
    tabSignup.classList.remove("active");
    tabSignup.style.borderBottom = "2px solid transparent";
    tabSignup.style.color = "var(--text-secondary)";

    formLogin.style.display = "flex";
    formSignup.style.display = "none";
  });

  tabSignup?.addEventListener("click", () => {
    tabSignup.classList.add("active");
    tabSignup.style.borderBottom = "2px solid var(--accent-1)";
    tabSignup.style.color = "var(--text-primary)";

    tabLogin.classList.remove("active");
    tabLogin.style.borderBottom = "2px solid transparent";
    tabLogin.style.color = "var(--text-secondary)";

    formSignup.style.display = "flex";
    formLogin.style.display = "none";
  });

  // Submit Login Form
  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.style.display = "none";

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (hasFirebaseCredentials) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showSystemNotification("🔓 Logged in successfully!");
        window.appCloseAuthModal();
        formLogin.reset();
      } catch (err) {
        console.error(err);
        if (errorMsg) {
          errorMsg.textContent = err.message;
          errorMsg.style.display = "block";
        }
      }
    } else {
      // Local Storage Sign In
      try {
        const localUsers = JSON.parse(localStorage.getItem('devRoadmap_localUsers') || '{}');
        const user = localUsers[email.toLowerCase().trim()];
        if (!user || user.password !== password) {
          throw new Error("Invalid email or password.");
        }
        localStorage.setItem('devRoadmap_currentUser', JSON.stringify({
          username: user.username,
          email: user.email
        }));
        showSystemNotification("🔓 Logged in successfully!");
        window.appCloseAuthModal();
        formLogin.reset();
        
        // Reload state and refresh view
        import('../services/state.js').then(({ loadState }) => {
          loadState();
          import('../main.js').then(({ updateAuthUI, switchView }) => {
            updateAuthUI({ displayName: user.username, email: user.email });
            switchView('dashboard');
          });
        });
      } catch (err) {
        console.error(err);
        if (errorMsg) {
          errorMsg.textContent = err.message;
          errorMsg.style.display = "block";
        }
      }
    }
  });

  // Submit Signup Form
  formSignup?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.style.display = "none";

    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (hasFirebaseCredentials) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        showSystemNotification("✨ Account created successfully!");
        window.appCloseAuthModal();
        formSignup.reset();
      } catch (err) {
        console.error(err);
        if (errorMsg) {
          errorMsg.textContent = err.message;
          errorMsg.style.display = "block";
        }
      }
    } else {
      // Local Storage Sign Up
      try {
        if (!username || !email || !password) {
          throw new Error("Please fill in all fields.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        const localUsers = JSON.parse(localStorage.getItem('devRoadmap_localUsers') || '{}');
        const lowerEmail = email.toLowerCase().trim();
        if (localUsers[lowerEmail]) {
          throw new Error("Email already registered.");
        }
        
        localUsers[lowerEmail] = { username, email, password };
        localStorage.setItem('devRoadmap_localUsers', JSON.stringify(localUsers));
        
        localStorage.setItem('devRoadmap_currentUser', JSON.stringify({ username, email }));
        showSystemNotification("✨ Account created successfully!");
        window.appCloseAuthModal();
        formSignup.reset();
        
        // Reload state and refresh view
        import('../services/state.js').then(({ loadState }) => {
          loadState();
          import('../main.js').then(({ updateAuthUI, switchView }) => {
            updateAuthUI({ displayName: username, email });
            switchView('dashboard');
          });
        });
      } catch (err) {
        console.error(err);
        if (errorMsg) {
          errorMsg.textContent = err.message;
          errorMsg.style.display = "block";
        }
      }
    }
  });
}

export async function signOutUser() {
  if (hasFirebaseCredentials && auth) {
    try {
      await firebaseSignOut(auth);
      showSystemNotification("🔒 Signed out successfully!");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  } else {
    // Local storage sign out
    localStorage.removeItem('devRoadmap_currentUser');
    showSystemNotification("🔒 Signed out successfully!");
    
    // Reload state and reset UI
    import('../services/state.js').then(({ loadState }) => {
      loadState();
      import('../main.js').then(({ updateAuthUI }) => {
        updateAuthUI(null);
        window.appOpenAuthModal(true); // Open blocking login modal
      });
    });
  }
}

window.appSignOutUser = signOutUser;
