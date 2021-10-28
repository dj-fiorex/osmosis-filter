export const section = (selectElement) => {
  return `
    <section id="mainSection" class="css-1rrfl6n">
    <div class="css-1flj1x4">
    <div style="display: flex; justify-content: space-between;">
    
    <h4 class="css-13j0qoo">Ordered Pools</h4>
    
    <div>
    
    ${selectElement}

    </div>

    </div>
    <ul id="orderedPoolsUl" class="css-iqw9p3">
    
    </ul>
    </div>
    </section>
    `;
};
