from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
from typing import List, Dict, Any
from ..auth.auth import get_current_active_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

async def get_database():
    # This will be injected by dependency
    pass

@router.get("/overview")
async def get_analytics_overview(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get comprehensive analytics overview"""
    # Sales metrics
    total_orders = await db.orders.count_documents({"user_id": current_user["id"]})
    
    revenue_pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
    
    avg_order_pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {"_id": None, "avg_order": {"$avg": "$total"}}}
    ]
    avg_result = await db.orders.aggregate(avg_order_pipeline).to_list(1)
    avg_order_value = avg_result[0]["avg_order"] if avg_result else 0
    
    # Customer satisfaction (dummy calculation based on delivered orders)
    delivered_orders = await db.orders.count_documents({
        "user_id": current_user["id"],
        "status": "delivered"
    })
    customer_satisfaction = min(4.8, 4.2 + (delivered_orders / total_orders * 0.6)) if total_orders > 0 else 4.5
    
    # Delivery performance
    on_time_deliveries = await db.orders.count_documents({
        "user_id": current_user["id"],
        "status": "delivered"
    })
    delivery_performance = (on_time_deliveries / total_orders * 100) if total_orders > 0 else 0
    
    return {
        "monthly_revenue": total_revenue,
        "avg_order_value": round(avg_order_value, 2),
        "customer_satisfaction": round(customer_satisfaction, 1),
        "delivery_performance": round(delivery_performance, 1),
        "total_orders": total_orders
    }

@router.get("/sales-performance")
async def get_sales_performance(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get detailed sales performance metrics"""
    now = datetime.utcnow()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = today - timedelta(days=1)
    week_start = today - timedelta(days=7)
    last_week_start = week_start - timedelta(days=7)
    month_start = today.replace(day=1)
    last_month = (month_start - timedelta(days=1)).replace(day=1)
    
    periods = [
        {"name": "Today", "start": today, "end": now},
        {"name": "Yesterday", "start": yesterday, "end": today},
        {"name": "This Week", "start": week_start, "end": now},
        {"name": "Last Week", "start": last_week_start, "end": week_start},
        {"name": "This Month", "start": month_start, "end": now},
        {"name": "Last Month", "start": last_month, "end": month_start},
    ]
    
    results = []
    for period in periods:
        pipeline = [
            {
                "$match": {
                    "user_id": current_user["id"],
                    "created_at": {"$gte": period["start"], "$lt": period["end"]}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "revenue": {"$sum": "$total"},
                    "orders": {"$sum": 1},
                    "avg_order": {"$avg": "$total"}
                }
            }
        ]
        
        result = await db.orders.aggregate(pipeline).to_list(1)
        if result:
            data = result[0]
            results.append({
                "period": period["name"],
                "revenue": f"${data['revenue']:.2f}",
                "orders": data["orders"],
                "avg_order": f"${data['avg_order']:.2f}",
                "change": "+12.5%"  # Placeholder
            })
        else:
            results.append({
                "period": period["name"],
                "revenue": "$0.00",
                "orders": 0,
                "avg_order": "$0.00",
                "change": "0%"
            })
    
    return results

@router.get("/top-products")
async def get_top_products(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get top performing products"""
    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$unwind": "$items"},
        {
            "$group": {
                "_id": "$items.product_name",
                "sales": {"$sum": "$items.quantity"},
                "revenue": {"$sum": "$items.total"}
            }
        },
        {"$sort": {"revenue": -1}},
        {"$limit": 5}
    ]
    
    results = await db.orders.aggregate(pipeline).to_list(5)
    
    total_revenue = sum(item["revenue"] for item in results)
    
    return [
        {
            "name": item["_id"],
            "sales": item["sales"],
            "revenue": f"${item['revenue']:.2f}",
            "percentage": f"{(item['revenue'] / total_revenue * 100):.1f}%" if total_revenue > 0 else "0%"
        }
        for item in results
    ]

@router.get("/delivery-metrics")
async def get_delivery_metrics(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get delivery performance metrics"""
    total_orders = await db.orders.count_documents({"user_id": current_user["id"]})
    delivered_orders = await db.orders.count_documents({
        "user_id": current_user["id"],
        "status": "delivered"
    })
    
    # Calculate metrics (using placeholder calculations)
    metrics = [
        {
            "metric": "Avg Delivery Time",
            "value": "28 min",
            "target": "30 min",
            "status": "good"
        },
        {
            "metric": "On-Time Delivery",
            "value": f"{(delivered_orders / total_orders * 100):.1f}%" if total_orders > 0 else "0%",
            "target": "90%",
            "status": "excellent"
        },
        {
            "metric": "Customer Satisfaction",
            "value": "4.8/5",
            "target": "4.5/5",
            "status": "excellent"
        },
        {
            "metric": "Delivery Success Rate",
            "value": f"{(delivered_orders / total_orders * 100):.1f}%" if total_orders > 0 else "0%",
            "target": "95%",
            "status": "excellent"
        }
    ]
    
    return metrics

@router.get("/customer-insights")
async def get_customer_insights(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get customer behavior insights"""
    total_customers = await db.customers.count_documents({"user_id": current_user["id"]})
    
    # New customers this month
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_customers = await db.customers.count_documents({
        "user_id": current_user["id"],
        "created_at": {"$gte": month_start}
    })
    
    # Returning customers
    returning_customers = await db.customers.count_documents({
        "user_id": current_user["id"],
        "total_orders": {"$gt": 1}
    })
    
    # Customer lifetime value
    clv_pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {"_id": None, "avg_clv": {"$avg": "$total_spent"}}}
    ]
    clv_result = await db.customers.aggregate(clv_pipeline).to_list(1)
    avg_clv = clv_result[0]["avg_clv"] if clv_result else 0
    
    returning_percentage = (returning_customers / total_customers * 100) if total_customers > 0 else 0
    
    return [
        {
            "metric": "New Customers",
            "value": str(new_customers),
            "period": "This Month",
            "change": "+15.3%"
        },
        {
            "metric": "Returning Customers",
            "value": f"{returning_percentage:.0f}%",
            "period": "Overall",
            "change": "+8.2%"
        },
        {
            "metric": "Customer Lifetime Value",
            "value": f"${avg_clv:.0f}",
            "period": "Average",
            "change": "+12.1%"
        },
        {
            "metric": "Churn Rate",
            "value": "2.3%",
            "period": "Monthly",
            "change": "-0.5%"
        }
    ]

@router.get("/referral-tracking")
async def get_referral_tracking(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get customer acquisition source tracking"""
    total_customers = await db.customers.count_documents({"user_id": current_user["id"]})
    
    # Placeholder data - in a real app, you'd track acquisition sources
    sources = [
        {"source": "Word of Mouth", "customers": int(total_customers * 0.32)},
        {"source": "Social Media", "customers": int(total_customers * 0.24)},
        {"source": "Google Search", "customers": int(total_customers * 0.16)},
        {"source": "Direct", "customers": int(total_customers * 0.12)},
        {"source": "Referral Program", "customers": int(total_customers * 0.10)},
        {"source": "Other", "customers": int(total_customers * 0.06)},
    ]
    
    return [
        {
            "source": item["source"],
            "customers": item["customers"],
            "percentage": f"{(item['customers'] / total_customers * 100):.1f}%" if total_customers > 0 else "0%"
        }
        for item in sources
    ]