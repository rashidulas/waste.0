import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import numpy as np


# Generate dummy data for the last 30 days
date_range = pd.date_range(datetime.now() - timedelta(days=30), periods=30)

# Create a dummy dataframe for actual surplus for the 'Fruits' category
category = 'Surplu'
actual_surplus_data = pd.DataFrame({
    'Date': date_range,
    category: np.random.randint(20, 50, size=30),
})

# Simulate predicted surplus reduction based on the prediction model
# Predicted values are significantly lower than actual values (e.g., 50% reduction)
predicted_surplus_data = actual_surplus_data.copy()
predicted_surplus_data[category] = actual_surplus_data[category] * 0.4  # 50% reduction in surplus

# Create pivot tables for the actual and predicted surplus
actual_pivot = actual_surplus_data.set_index('Date')
predicted_pivot = predicted_surplus_data.set_index('Date')


# Plot the actual and predicted surplus data for 'Fruits'
fig = px.line(
    actual_pivot, 
    x=actual_pivot.index, 
    y=actual_pivot[category],
    labels={'value': 'Surplus Amount', 'variable': 'Category'}, 
    title='Surplus vs Predicted Surplus Reduction'
)

# Set the actual surplus line to be dashed and orange
fig.update_traces(line=dict(dash='dash'), name=f'Actual {category}')

# Add predicted surplus to the same plot, making it a solid line
fig.add_scatter(
    x=predicted_pivot.index, 
    y=predicted_pivot[category],
    mode='lines', 
    name=f'Predicted {category}', 
    line=dict(color='orange')  # Solid line
)

# Update layout for readability
fig.update_layout(
    xaxis_title='Date',
    yaxis_title='Surplus Amount',
    hovermode="x unified",
    yaxis=dict(range=[0, actual_pivot.max().max() + 20]),
    xaxis_tickangle=-45
)

# Display the chart
st.plotly_chart(fig, use_container_width=True)
